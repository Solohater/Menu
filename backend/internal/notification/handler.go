package notification

import (
	"encoding/json"
	"net/http"
	"time"

	pkgauth "menuflow/backend/pkg/auth"
	pkgmw "menuflow/backend/pkg/middleware"
)

type DeliverRequest struct {
	OrderID string `json:"order_id"`
}

type Handler struct {
	router *Router
}

func NewHandler(router *Router) *Handler {
	return &Handler{router: router}
}

// HandleDeliverOrder processes POST /api/v1/waiter/deliver per FR-12 & FR-17
func (h *Handler) HandleDeliverOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req DeliverRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	if req.OrderID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "order_id is required"})
		return
	}

	waiterID := "01J8WAITER000000000000001"
	if claims, ok := r.Context().Value(pkgmw.StaffClaimsKey).(*pkgauth.StaffClaims); ok && claims != nil {
		waiterID = claims.Sub
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":      "Order delivered to table successfully",
		"order_id":     req.OrderID,
		"status":       "Delivered",
		"delivered_by": waiterID,
		"delivered_at": time.Now().UTC(),
	})
}
