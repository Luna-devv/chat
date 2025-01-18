import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Config } from "constants/config";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { APIPostUserBody, APIPostUserBodySchema } from "types/users";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";

enum Type {
    Login = "login",
    Create = "create"
}

const fields = [
    "email",
    "username",
    "password"
] as const;

export default function Register() {
    const [type, setType] = useState<Type>(Type.Login);

    const form = useForm<APIPostUserBody>({
        resolver: zodResolver(APIPostUserBodySchema),
        defaultValues: {
            email: "",
            username: "",
            password: ""
        }
    });

    console.log(form)

    function onSubmit(data: APIPostUserBody) {
        console.log(data)
    }

    return (
        <div className="bg-[url('/background.avif')] bg-cover bg-no-repeat h-screen w-full flex justify-start p-24">
            <div className="p-6 border bg-card/75 backdrop-blur border-muted rounded-lg h-fit min-w-[24rem]">
                <h1 className="text-2xl font-medium ">👋 Welcome to {Config.platform_name}</h1>
                <p className="text-sm text-muted-foreground">Tell us who you are to start chatting!</p>

                <Tabs
                    defaultValue="account"
                    className="w-full mt-4 mb-2"
                    onValueChange={(value) => setType(value as Type)}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value={Type.Login}>Login</TabsTrigger>
                        <TabsTrigger value={Type.Create}>Create</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-1"
                    >
                        {fields.map((id) =>
                           (type === Type.Login && id === "username") ? null : (
                            <FormField
                                control={form.control}
                                name={id}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {id.replace(/^\w/, (char) => char.toUpperCase())}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type={id} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        {/* email && password && (type === Type.Create ? username : true) &&
                            <Turnstile
                                className="!mt-4 w-full"
                                siteKey={Config.captcha_site_key}
                            />
                        */}

                        <Button type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>

            </div>
        </div>
    );
}