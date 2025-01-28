export function Auth({ children }: { children: React.ReactNode; }) {
    return (
        <div className="flex h-screen w-full items-center justify-start bg-[url('/background.avif')] bg-cover bg-no-repeat sm:p-32">
            <div className="size-full min-w-96 rounded-lg border border-muted bg-background/80 p-6 backdrop-blur-md sm:size-fit sm:max-w-96">
                {children}
            </div>
        </div>
    );
}

//
export function AuthTitle({ children }: { children: React.ReactNode; }) {
    return <h1 className="text-2xl font-medium ">{children}</h1>;
}

//
export function AuthDescription({ children }: { children: React.ReactNode; }) {
    return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function AuthContent({ children }: { children: React.ReactNode; }) {
    return <div className="mt-5">{children}</div>;
}