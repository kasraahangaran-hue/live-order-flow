import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Demo from "./pages/Demo.tsx";
import Index from "./pages/Index.tsx";
import Orders from "./pages/Orders.tsx";
import Home from "./pages/Home.tsx";
import Pricing from "./pages/Pricing.tsx";
import Help from "./pages/Help.tsx";
import More from "./pages/More.tsx";
import OrderReceived from "./pages/OrderReceived.tsx";
import OrderCollected from "./pages/OrderCollected.tsx";
import Processing from "./pages/Processing.tsx";
import PaymentFailed from "./pages/PaymentFailed.tsx";
import OrderComplete from "./pages/OrderComplete.tsx";
import DriverOnTheWay from "./pages/DriverOnTheWay.tsx";
import DriverAssigned from "./pages/DriverAssigned.tsx";
import OutForDropOff from "./pages/OutForDropOff.tsx";
import DropOffFailed from "./pages/DropOffFailed.tsx";
import ApprovalRequired from "./pages/ApprovalRequired.tsx";
import PartialDelivery from "./pages/PartialDelivery.tsx";
import PendingItemDelivery from "./pages/PendingItemDelivery.tsx";
import Cancelled from "./pages/Cancelled.tsx";
import PRD from "./pages/PRD.tsx";
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
          <Route path="/home" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/help" element={<Help />} />
          <Route path="/more" element={<More />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/order-received" element={<OrderReceived />} />
          <Route path="/order-collected" element={<OrderCollected />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/out-for-delivery" element={<Index />} />
          <Route path="/driver-on-the-way" element={<DriverOnTheWay />} />
          <Route path="/driver-assigned" element={<DriverAssigned />} />
          <Route path="/out-for-drop-off" element={<OutForDropOff />} />
          <Route path="/drop-off-failed" element={<DropOffFailed />} />
          <Route path="/approval-required" element={<ApprovalRequired />} />
          <Route path="/partial-delivery" element={<PartialDelivery />} />
          <Route path="/pending-item-delivery" element={<PendingItemDelivery />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/cancelled" element={<Cancelled />} />
          <Route path="/order-complete" element={<OrderComplete />} />
          <Route path="/prd" element={<PRD />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
