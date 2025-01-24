export function Auth({ children }: { children: React.ReactNode; }) {
    return (
        <div className="bg-[url('/background.avif')] bg-cover bg-no-repeat h-screen w-full flex items-center justify-start sm:p-32">
            <div className="p-6 border bg-card/75 backdrop-blur border-muted rounded-lg h-full sm:h-fit w-full sm:w-fit sm:max-w-[24rem] min-w-[24rem]">
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