package notification_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	internalnotif "menuflow/backend/internal/notification"
	pkgws "menuflow/backend/pkg/websocket"
)

func TestRouteReadyEvent(t *testing.T) {
	hub := pkgws.NewHub()
	router := internalnotif.NewRouter(hub)

	// 1. Test Table-Service Ready Routing
	evtTable := internalnotif.ReadyEvent{
		OrderID:           "01J8ORD100",
		OrderRef:          "MF-8942-T4",
		RestaurantID:      "01J8REST100",
		TableLabel:        "Table 04",
		EstablishmentMode: "table_service",
		ItemsSummary:      []string{"Special Shekla Tibs"},
	}

	err := router.RouteReadyEvent(context.Background(), evtTable)
	if err != nil {
		t.Fatalf("failed to route table_service ready event: %v", err)
	}

	// 2. Test Self-Service Ready Routing
	evtSelf := internalnotif.ReadyEvent{
		OrderID:           "01J8ORD101",
		OrderRef:          "MF-8943-P4",
		RestaurantID:      "01J8REST100",
		TableLabel:        "Pickup #P04",
		EstablishmentMode: "self_service",
		ItemsSummary:      []string{"Royal Beyaynetu Platter"},
	}

	errSelf := router.RouteReadyEvent(context.Background(), evtSelf)
	if errSelf != nil {
		t.Fatalf("failed to route self_service ready event: %v", errSelf)
	}
}

func TestDeliverOrderHandler(t *testing.T) {
	hub := pkgws.NewHub()
	router := internalnotif.NewRouter(hub)
	handler := internalnotif.NewHandler(router)

	body, _ := json.Marshal(map[string]string{"order_id": "01J8ORD100"})
	req := httptest.NewRequest(http.MethodPost, "/api/v1/waiter/deliver", bytes.NewReader(body))
	rec := httptest.NewRecorder()

	handler.HandleDeliverOrder(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for deliver order, got %d", rec.Code)
	}

	var resp map[string]interface{}
	json.Unmarshal(rec.Body.Bytes(), &resp)

	if resp["status"] != "Delivered" {
		t.Errorf("expected status Delivered, got %v", resp["status"])
	}
}
