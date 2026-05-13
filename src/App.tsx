import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Demo from "./pages/Demo.tsx";
import DropoffToday from "./pages/DropoffToday.tsx";
import Orders from "./pages/Orders.tsx";
import OrderReceived from "./pages/OrderReceived.tsx";
import PickupCompleted from "./pages/PickupCompleted.tsx";
import ItemsSorted from "./pages/ItemsSorted.tsx";
import PaymentFailed from "./pages/PaymentFailed.tsx";
import DropoffCompleted from "./pages/DropoffCompleted.tsx";
import PickupInProgress from "./pages/PickupInProgress.tsx";
import DropoffInProgress from "./pages/DropoffInProgress.tsx";
import PickupAssigned from "./pages/PickupAssigned.tsx";
import DropoffAssigned from "./pages/DropoffAssigned.tsx";
import DropoffFailed from "./pages/DropoffFailed.tsx";
import ItemsPendingApproval from "./pages/ItemsPendingApproval.tsx";
import PendingItemsDelivery from "./pages/PendingItemsDelivery.tsx";
import OrderCancelled from "./pages/OrderCancelled.tsx";
import LaundryBagOrder from "./pages/LaundryBagOrder.tsx";
import PRD from "./pages/PRD.tsx";
import WashAndFoldInfo from "./pages/WashAndFoldInfo.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ScrollToTop } from "./components/nav/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/order-received" element={<OrderReceived />} />
          <Route path="/pickup-completed" element={<PickupCompleted />} />
          <Route path="/items-sorted" element={<ItemsSorted />} />
          <Route path="/dropoff-today" element={<DropoffToday />} />
          <Route path="/pickup-in-progress" element={<PickupInProgress />} />
          <Route path="/dropoff-in-progress" element={<DropoffInProgress />} />
          <Route path="/pickup-assigned" element={<PickupAssigned />} />
          <Route path="/dropoff-assigned" element={<DropoffAssigned />} />
          <Route path="/dropoff-failed" element={<DropoffFailed />} />
          <Route path="/items-pending-approval" element={<ItemsPendingApproval />} />
          <Route path="/pending-items-delivery-partial" element={<PendingItemsDelivery />} />
          <Route path="/pending-items-delivery-followup" element={<PendingItemsDelivery />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/order-cancelled" element={<OrderCancelled />} />
          <Route path="/laundry-bag" element={<LaundryBagOrder />} />
          <Route path="/dropoff-completed" element={<DropoffCompleted />} />
          <Route path="/prd" element={<PRD />} />
          <Route path="/wash-and-fold-info" element={<WashAndFoldInfo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
