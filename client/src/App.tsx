import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { LoginModal } from "@/components/auth/login-modal";
import AdminDashboard from "@/pages/admin-dashboard";
import CustomerApp from "@/pages/customer-app";
import { RechargeDetail } from "@/components/customer/recharge-detail";
import RechargePage from "@/pages/recharge-page";
import TopUpRecordsPage from "@/pages/top-up-records";
import WithdrawalPage from "@/pages/withdrawal-page";
import CustomerServicePage from "@/pages/customer-service";
import FundingInformation from "@/pages/funding-information";
import WithdrawalRequest from "@/pages/withdrawal-request";
import WithdrawalRecord from "@/pages/withdrawal-record";
import OrderRecord from "@/pages/order-record";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginModal />;
  }

  return (
    <Switch>
      <Route path="/" component={user.role === "admin" ? AdminDashboard : CustomerApp} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/customer" component={CustomerApp} />
      <Route path="/recharge" component={RechargePage} />
      <Route path="/top-up-records" component={TopUpRecordsPage} />
      <Route path="/withdrawal" component={WithdrawalPage} />

      <Route path="/customer-service" component={CustomerServicePage} />
      <Route path="/funding-information" component={FundingInformation} />
      <Route path="/withdrawal-request" component={WithdrawalRequest} />
      <Route path="/withdrawal-record" component={WithdrawalRecord} />
      <Route path="/order-record" component={OrderRecord} />
      <Route path="/spot-orders">
        {() => {
          const SpotOrdersComponent = React.lazy(() => 
            import("./components/customer/spot-orders").then(m => ({ default: m.SpotOrders }))
          );
          return (
            <React.Suspense fallback={<div>Loading...</div>}>
              <SpotOrdersComponent />
            </React.Suspense>
          );
        }}
      </Route>
      <Route path="/recharge-detail/:id" component={RechargeDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
