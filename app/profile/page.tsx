"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CheckCircle2, AlertCircle, Upload } from "lucide-react";

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isOAuthOnly, setIsOAuthOnly] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Email change state
  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  });

  // Username change state
  const [usernameData, setUsernameData] = useState({
    newUsername: "",
  });

  // Check if user is OAuth only
  useEffect(() => {
    const checkAuthMethod = async () => {
      try {
        const response = await fetch("/api/user/auth-method");
        if (response.ok) {
          const data = await response.json();
          setIsOAuthOnly(data.isOAuthOnly);
        }
      } catch (error) {
        console.error("Error checking auth method:", error);
      }
    };

    if (session) {
      checkAuthMethod();
    }
  }, [session]);

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "De nya lösenorden matchar inte",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Lösenordet måste vara minst 8 tecken",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Lösenordet har ändrats",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Kunde inte ändra lösenord",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Ett fel uppstod",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!usernameData.newUsername.trim()) {
      setMessage({
        type: "error",
        text: "Användarnamnet kan inte vara tomt",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/change-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usernameData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Användarnamnet har ändrats",
        });
        setUsernameData({
          newUsername: "",
        });
        // Update session with new username
        await update();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Kunde inte ändra användarnamn",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Ett fel uppstod",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!emailData.newEmail || !emailData.password) {
      setMessage({
        type: "error",
        text: "Fyll i alla fält",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "E-postadressen har ändrats",
        });
        setEmailData({
          newEmail: "",
          password: "",
        });
        // Update session with new email
        await update();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Kunde inte ändra e-postadress",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Ett fel uppstod",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Vänligen välj en bildfil",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Bilden får inte vara större än 5MB",
      });
      return;
    }

    setUploadingImage(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Profilbilden har uppdaterats",
        });
        // Update session with new image
        await update();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Kunde inte ladda upp bild",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Ett fel uppstod vid uppladdning",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="font-cinzel text-4xl font-bold text-navy dark:text-cream mb-8">
        Profilinställningar
      </h1>

      {message && (
        <Alert
          className="mb-6"
          variant={message.type === "error" ? "destructive" : "default"}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Picture */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profilbild</CardTitle>
            <CardDescription>
              {isOAuthOnly
                ? "Din profilbild hämtas från ditt Google-konto"
                : "Ladda upp en egen profilbild"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={session.user.image || undefined}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
              {!isOAuthOnly ? (
                <div className="flex-1">
                  <Label
                    htmlFor="profile-image"
                    className="cursor-pointer inline-block"
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors ${
                        uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Laddar upp...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Välj ny bild
                        </>
                      )}
                    </div>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG eller GIF. Max 5MB.
                  </p>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Din profilbild synkroniseras automatiskt med ditt
                    Google-konto. För att ändra den, uppdatera din profilbild i
                    Google.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Kontoinformation</CardTitle>
            <CardDescription>Din aktuella kontoinformation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Namn</Label>
              <p className="font-semibold">
                {session.user.name || "Inget namn"}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                E-postadress
              </Label>
              <p className="font-semibold">{session.user.email}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Roll</Label>
              <p className="font-semibold">{session.user.role}</p>
            </div>
            {isOAuthOnly && (
              <div className="pt-2 border-t">
                <Label className="text-sm text-muted-foreground">
                  Inloggningsmetod
                </Label>
                <p className="font-semibold flex items-center gap-2">
                  Google OAuth
                  <span className="text-xs font-normal text-muted-foreground">
                    (E-post och lösenord kan inte ändras)
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Username */}
        <Card>
          <CardHeader>
            <CardTitle>Byt användarnamn</CardTitle>
            <CardDescription>Ändra ditt visningsnamn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUsernameChange} className="space-y-4">
              <div>
                <Label htmlFor="new-username">Nytt användarnamn</Label>
                <Input
                  id="new-username"
                  type="text"
                  value={usernameData.newUsername}
                  onChange={(e) =>
                    setUsernameData({
                      newUsername: e.target.value,
                    })
                  }
                  placeholder={session.user.name || "Ange användarnamn"}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Byt användarnamn
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password - Only for credentials users */}
        {!isOAuthOnly && (
          <Card>
            <CardHeader>
              <CardTitle>Byt lösenord</CardTitle>
              <CardDescription>
                Ändra ditt lösenord (minst 8 tecken)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Nuvarande lösenord</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">Nytt lösenord</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">
                    Bekräfta nytt lösenord
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Byt lösenord
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Change Email - Only for credentials users */}
        {!isOAuthOnly && (
          <Card>
            <CardHeader>
              <CardTitle>Byt e-postadress</CardTitle>
              <CardDescription>
                Ändra din e-postadress (kräver ditt lösenord för säkerhet)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <Label htmlFor="new-email">Ny e-postadress</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) =>
                      setEmailData((prev) => ({
                        ...prev,
                        newEmail: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email-password">
                    Bekräfta med ditt lösenord
                  </Label>
                  <Input
                    id="email-password"
                    type="password"
                    value={emailData.password}
                    onChange={(e) =>
                      setEmailData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Byt e-postadress
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
