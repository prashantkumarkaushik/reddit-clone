import { AuthModal } from "@/components/Modals/Auth/AuthModal";
import { auth } from "@/firebase/clientApp";
import { Button, Flex } from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { AuthButtons } from "./AuthButtons";
import { Icons } from "./Icons";
import { UserMenu } from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

export const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex alignItems="center" justifyContent="space-between">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
