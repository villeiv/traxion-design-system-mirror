function Card({ children }: { children: React.ReactNode }) {
  return <div className={"bg-primary text-red-500"}>Card Component: {children}</div>;
}