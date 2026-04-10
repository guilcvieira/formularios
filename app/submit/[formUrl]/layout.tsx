import DesignerContextProvider from '@/components/context/DesignerContext';
import Logo from '@/components/Logo';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="bg-background flex max-h-screen min-h-screen min-w-screen flex-col">
      <nav className="border-border flex h-14 items-center justify-between border-b px-4 pt-2">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
      <DesignerContextProvider>
        <main className="flex flex-1 justify-center">{children}</main>
      </DesignerContextProvider>
    </div>
  );
}
