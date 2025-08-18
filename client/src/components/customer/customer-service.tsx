import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Mail, Clock, User, HelpCircle, Send } from "lucide-react";

export function CustomerService() {
  const [activeTab, setActiveTab] = useState("contact");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      status: "Online",
      statusColor: "bg-green-500",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1-800-ATTAR-COIN",
      status: "Available 24/7",
      statusColor: "bg-blue-500",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@attarcoin.com",
      status: "Response within 2 hours",
      statusColor: "bg-orange-500",
      action: "Send Email"
    }
  ];

  const faqs = [
    {
      question: "How do I deposit funds?",
      answer: "Go to the 'Recharge' section from the home tab and follow the instructions to add funds to your account."
    },
    {
      question: "How long does withdrawal take?",
      answer: "Withdrawals are typically processed within 1-3 business days after approval."
    },
    {
      question: "What are the trading fees?",
      answer: "Trading fees vary based on the duration: 60S (20%), 120S (30%), 180S (50%)."
    },
    {
      question: "How do I reset my password?",
      answer: "Use the 'Forgot Password' link on the login page or contact customer support."
    },
    {
      question: "What cryptocurrencies are supported?",
      answer: "We support BTC, ETH, DOGE, CHZ, PSG, ATM, JUV, KSM, LTC, EOS, BTS, LINK and many more."
    }
  ];

  const tickets = [
    {
      id: "AT-001",
      subject: "Withdrawal Issue",
      status: "In Progress",
      date: "2025-08-18",
      priority: "High"
    },
    {
      id: "AT-002", 
      subject: "Account Verification",
      status: "Resolved",
      date: "2025-08-17",
      priority: "Medium"
    },
    {
      id: "AT-003",
      subject: "Trading Question",
      status: "Open",
      date: "2025-08-16",
      priority: "Low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-yellow-500";
      case "In Progress": return "bg-blue-500";
      case "Resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-500";
      case "Medium": return "text-orange-500";
      case "Low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="h-full bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Customer Service</h1>
          <p className="text-gray-600">We're here to help you with any questions or issues</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          {[
            { id: "contact", label: "Contact Us", icon: MessageCircle },
            { id: "faq", label: "FAQ", icon: HelpCircle },
            { id: "tickets", label: "My Tickets", icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{method.title}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${method.statusColor}`}></div>
                        <span className="text-xs text-gray-500">{method.status}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Send us a message</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Describe your issue or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                  />
                </div>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">#{ticket.id}</span>
                        <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                          {ticket.status}
                        </Badge>
                        <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} Priority
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{ticket.date}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {tickets.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No support tickets</h3>
                  <p className="text-gray-600">You haven't submitted any support tickets yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}