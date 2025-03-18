import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");

  const updateAvatarMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await apiRequest("POST", "/api/profile/avatar", { avatarUrl: url });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatarUrl || ""} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-4 flex-1">
                <div>
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="avatar-url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Enter image URL"
                    />
                    <Button
                      onClick={() => updateAvatarMutation.mutate(avatarUrl)}
                      disabled={updateAvatarMutation.isPending}
                    >
                      {updateAvatarMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={user?.username} disabled />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email} disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
