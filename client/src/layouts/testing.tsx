import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Card,
  CardBody,
  Avatar,
  VStack,
  BoxProps,
  FlexProps,
  Button,
} from "@chakra-ui/react";
import { FiMenu, FiBell } from "react-icons/fi";
import { BiHome } from "react-icons/bi";
import {
  IoIosSwap,
  IoIosHourglass,
  IoMdAddCircleOutline,
} from "react-icons/io";
import { GiServerRack } from "react-icons/gi";
import { RiDashboard3Line } from "react-icons/ri";
// import { ConnectWallet } from "@thirdweb-dev/react";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { Outlet, useNavigate } from "react-router-dom";
import { IconType } from "react-icons";
import { VscFeedback } from "react-icons/vsc";

interface LinkItemProps {
    name: string;
    icon: IconType;
    href: string;
  }

const LinkItems = [
  {
    name: "Dashboard",
    icon: BiHome,
    href: `/dashboard`,
  },
  // {
  //   name: "Buy Hobo",
  //   icon: HiOutlineViewGridAdd,
  //   href: `/dashboard`,
  // },
  {
    name: "Feedback",
    icon: VscFeedback,
    href: `/feedback`,
  },
 
];

export default function TestingLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
      <Box
        minH="100vh"
        bg={useColorModeValue("gray.100", "gray.900")}
        fontFamily={"Inconsolata"}
      >
        <SidebarContent
          onClose={() => onClose}
          display={{ base: "none", md: "block" }}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} />

        <Box ml={{ base: 0, md: 60 }} p="4">
          <Outlet />
        </Box>
      </Box>
  );
}
interface SidebarProps extends BoxProps {
    onClose: () => void;
  }

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const navigate = useNavigate();
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          cursor={"pointer"}
          textTransform={"uppercase"}
          onClick={() => navigate("/")}
        >
          Eazzy Afia
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Card mx={3} bg={useColorModeValue("gray.50", "gray.900")}>
        <CardBody>
          <HStack spacing={4}>
            <Avatar
              name="Dan Abrahmov"
              src="https://bit.ly/dan-abramov"
              size={"sm"}
            />
            <VStack alignItems={"start"} spacing={1}>
              <Text fontSize="xs" fontWeight="bold" textTransform={"uppercase"}>
                Cameron Williamson
              </Text>
              <Text fontSize="xs" color="gray.500">
                admin
              </Text>
            </VStack>
          </HStack>
        </CardBody>
      </Card>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link?.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};
interface NavItemProps extends FlexProps {
    icon: IconType;
    href: string;
    children: ReactNode;
  }
const NavItem = ({ icon, href, children, ...rest } : NavItemProps) => {
  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "gray.800",
          color: "white",
        }}
        fontSize={"sm"}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
  }

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        HB
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
      
      </HStack>
    </Flex>
  );
};
