import { Box, Flex, Text, HStack, Button, Spacer, Switch, InputGroup, InputLeftElement, Input, Menu, MenuButton, MenuList, MenuItem, SimpleGrid } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Helmet } from "react-helmet";
import { IoIosSearch } from "react-icons/io";
import { TbChevronDown } from "react-icons/tb";
import { AppointementStatus } from '@/types/status';


const dashboard = () => {
    const [activeBtn, setActiveBtn] = useState("Approved");
    const [menuSelected, setMenuSelected] = useState("Pending");
    const handleActiveBtn = (activeText: any) => setActiveBtn(activeText);
    const handleMenuSelected = (selectedMenu: any) => setMenuSelected(selectedMenu);
    
    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Box px={4} w={"full"}>
                <Flex justify={"space-evenly"} align={"center"}>
                    <HStack spacing={2}>
                        {activeBtn === "Approved" ? (
                            <Button
                                bg={"black"}
                                color={"white"}
                                textTransform={"uppercase"}
                                fontSize={"xs"}
                                _hover={{
                                    bg: "gray.700",
                                }}
                                onClick={() => handleActiveBtn("Approved")}
                                transition={
                                    "background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                                }
                            >
                                Approved
                            </Button>
                        ) : (
                            <Button
                                bg={"gray.200"}
                                color={"black"}
                                textTransform={"uppercase"}
                                fontSize={"xs"}
                                _hover={{
                                    bg: "gray.300",
                                }}
                                onClick={() => handleActiveBtn("Approved")}
                                transition={
                                    "background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                                }
                            >
                                Approved
                            </Button>
                        )}

                        {activeBtn === "Pending" ? (
                            <Button
                                bg={"black"}
                                color={"white"}
                                textTransform={"uppercase"}
                                fontSize={"xs"}
                                _hover={{
                                    bg: "gray.700",
                                }}
                                onClick={() => handleActiveBtn("Pending")}
                                transition={
                                    "background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                                }
                            >
                                Pending
                            </Button>
                        ) : (
                            <Button
                                bg={"gray.200"}
                                color={"black"}
                                textTransform={"uppercase"}
                                fontSize={"xs"}
                                _hover={{
                                    bg: "gray.300",
                                }}
                                onClick={() => handleActiveBtn("Pending")}
                                transition={
                                    "background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                                }
                            >
                                Pending
                            </Button>
                        )}
                    </HStack>
                    <Spacer />
                    <HStack spacing={2}>
                        <Switch colorScheme={"blackAlpha"} />
                        <Text
                            fontSize={"xs"}
                            textTransform={"uppercase"}
                            fontWeight={"semibold"}
                        >
                            Approved Only
                        </Text>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<IoIosSearch color="gray.300" />}
                            />
                            <Input
                                placeholder="Search appointment"
                                focusBorderColor="black"
                                fontSize={"sm"}
                            />
                        </InputGroup>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rightIcon={<TbChevronDown />}
                                bgColor={"gray.200"}
                                fontSize={"sm"}
                                fontWeight={"light"}
                            >
                                {menuSelected}
                            </MenuButton>
                            <MenuList>
                                <MenuItem
                                    fontSize={"xs"}
                                    fontWeight={"medium"}
                                    onClick={() => handleMenuSelected("Approved")}
                                >
                                    Approved
                                </MenuItem>
                                <MenuItem
                                    fontSize={"xs"}
                                    fontWeight={"medium"}
                                    onClick={() => handleMenuSelected("Pending")}
                                >
                                    Pending
                                </MenuItem>
                                <MenuItem
                                    fontSize={"xs"}
                                    fontWeight={"medium"}
                                    onClick={() => handleMenuSelected("Rejected")}
                                >
                                    Rejected
                                </MenuItem>
                              
                            </MenuList>
                        </Menu>
                    </HStack>
                </Flex>
                <SimpleGrid
                    columns={[2, 3, 6, 6]}
                    spacing={4}
                    mt={6}
                    w={"full"}
                    bg={"gray.200"}
                    borderRadius={"lg"}
                    p={4}
                >
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                        Service
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                        PhoneNo
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                        Name
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                        NationalID
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                       Date
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                       Status
                    </Text>
                </SimpleGrid>
                {/* {farm_details.map((item, i) => (
                    <FarmItem item={item} key={i} />
                ))} */}
            </Box>
        </>
    );
};

export default dashboard
