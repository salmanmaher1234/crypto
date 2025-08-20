import { Button } from "@/components/ui/button";
import { Home, Mail, MailOpen } from "lucide-react";
import { useMessages } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface UserMessagesProps {
  onBack: () => void;
}

export function UserMessages({ onBack }: UserMessagesProps) {
  const { data: messages, isLoading } = useMessages();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-1 mr-2"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-gray-900">User Message</h1>
          <div className="w-8"></div>
        </div>

        {/* Loading Content */}
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-1 mr-2"
          >
            <Home className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
        <h1 className="text-lg font-medium text-gray-900">User Message</h1>
        <div className="w-8"></div>
      </div>

      {/* Messages Content */}
      <div className="p-4">
        {!messages || messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8 mt-20">
            <div className="text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <div className="text-lg mb-2">No Messages</div>
              <div className="text-sm">You have no messages at this time.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <Card key={message.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {message.isRead ? (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="font-medium text-sm text-gray-900">
                        {message.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {message.content}
                  </div>
                  {message.type && message.type !== 'General' && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {message.type}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}