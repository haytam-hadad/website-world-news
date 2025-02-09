export default function Footer() {
  return (
    <footer className="flex items-center justify-center w-full h-16 mt-10 border-t bg-primary">
      <div className="flex items-center justify-center text-primary-foreground font-bold">
        <p className="text-sm text-center">
          Copyright &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
