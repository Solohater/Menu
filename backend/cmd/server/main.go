package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"menuflow/backend/internal/menu"
	"menuflow/backend/internal/order"
	"menuflow/backend/internal/tenant"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Service   string    `json:"service"`
	Timestamp time.Time `json:"timestamp"`
}

// corsMiddleware adds headers for cross-origin local Next.js frontend calls
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()

	// Initialize repositories and caches
	menuRepo := menu.NewMemoryRepository()
	menuCache := menu.NewCache()
	menuHandler := menu.NewHandler(menuRepo, menuCache)

	orderRepo := order.NewMemoryRepository()
	orderHandler := order.NewHandler(orderRepo)

	tenantRepo := tenant.NewMemoryRepository()
	tenantSecret := "menuflow_dev_secret_key_32bytes!"
	tenantHandler := tenant.NewHandler(tenantRepo, tenantSecret)

	// Health Check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(HealthResponse{
			Status:    "ok",
			Service:   "MenuFlow Go API",
			Timestamp: time.Now().UTC(),
		})
	})

	// Order & Sales Analytics Endpoints (Dashboard Card 1)
	mux.HandleFunc("/api/v1/admin/orders/sales-summary", orderHandler.HandleGetSalesSummary)
	mux.HandleFunc("/api/v1/orders/create", orderHandler.HandleCreateOrder)

	// Menu & Stock Manager Endpoints (Dashboard Card 3)
	mux.HandleFunc("/api/v1/guest/menu", menuHandler.HandleGetGuestMenu)
	mux.HandleFunc("/api/v1/admin/menu/prices/bulk", menuHandler.HandleBulkPrices)

	// Tables & Settings Endpoints (Dashboard Card 2)
	mux.HandleFunc("/api/v1/admin/tables", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			tenantHandler.HandleCreateTable(w, r)
			return
		}
		// Default response for list of active tables
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"restaurant_id": "01J8RESTAURANT000000000001",
			"active_tables": 11,
			"occupied":      5,
			"bill_pending":  3,
			"available":     3,
		})
	})
	mux.HandleFunc("/api/v1/admin/settings", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			tenantHandler.HandleUpdateSettings(w, r)
			return
		}
		tenantHandler.HandleGetSettings(w, r)
	})

	handlerWithCORS := corsMiddleware(mux)

	port := ":8080"
	fmt.Printf("MenuFlow Go Backend Monolith starting on %s...\n", port)
	if err := http.ListenAndServe(port, handlerWithCORS); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
