import { BottomTabBar } from "@/components/nav/BottomTabBar";

type Props = {
  title: string;
};

export const PlaceholderPage = ({ title }: Props) => (
  <main className="min-h-screen bg-background font-sans antialiased">
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 pb-24 text-center">
      <h1 className="text-2xl font-extrabold text-primary">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>
    </div>
    <BottomTabBar />
  </main>
);
