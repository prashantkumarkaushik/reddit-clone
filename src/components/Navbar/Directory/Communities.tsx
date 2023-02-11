import React, { useState } from "react";
import { Flex, MenuItem, Icon } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { CreateCommunityModal } from "@/components/Modals/CreateCommunities/CreateCommunityModal";

type Communitiesprops = {};

export const Communities: React.FC<Communitiesprops> = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <MenuItem
        width="100%"
        fontSize="10pt"
        _hover={{ bg: "gray.100" }}
        onClick={() => setOpen(true)}
      >
        <Flex align="center">
          <Icon as={GrAdd} fontSize={20} mr={2} />
          Create Community
        </Flex>
      </MenuItem>
    </>
  );
};
