import React from "react";
import { Menu, MenuButton, MenuList, Flex, Icon, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { TiHome } from "react-icons/ti";
import { Communities } from "./Communities";

export const Directory: React.FC = () => {
  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outlline: "1px solid ", outlineColor: "gray.200" }}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ sm: "auto", lg: "200px" }}
        >
          <Flex align="center">
            <Icon as={TiHome} fontSize={24} mr={{ base: 1, md: 2 }} />
            <Flex display={{ base: "none", md: "flex" }}>
              <Text fontSize="10pt" fontWeight={600}>
                Home
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
