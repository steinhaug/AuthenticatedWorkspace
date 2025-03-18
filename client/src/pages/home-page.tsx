import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Welcome, {user?.username}!</h1>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Your authentication skeleton is ready to be extended
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This skeleton includes user authentication, profile management,
                and secure session handling. Feel free to build upon this
                foundation to create your full application.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
