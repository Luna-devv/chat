import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Config } from "constants/config";

export default function Register() {

    return (
        <div className="bg-[url('/background.avif')] bg-cover bg-no-repeat h-screen w-full flex justify-start p-24">
            <div className="p-6 border bg-card/75 backdrop-blur border-muted rounded-lg h-fit">
                <h1 className="text-2xl font-medium">👋 Welcome to {Config.platform_name}</h1>
                <p className="text-sm text-muted-foreground">Tell us who you are to start chatting!</p>

                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
            </div>
        </div>
    )
}