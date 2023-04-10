import { AppointementStatus, IAppointment } from "@/types/Appointment";
import {
  Box,
  Flex,
  Text,
  HStack,
  Button,
  Spacer,
  Switch,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Tag,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { IoIosSearch } from "react-icons/io";
import { TbChevronDown } from "react-icons/tb";
import { toast } from "react-hot-toast";
import { getphones } from "@/utils";

const baseURL = "http://localhost:5000";

type TVariant = "approve" | "cancel";

interface ApproveCancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  variant: TVariant;
  appointmentId: number;
  refresh?: () => void;
}

const dashboard = () => {
  const [activeBtn, setActiveBtn] = useState("Approved");
  const [menuSelected, setMenuSelected] = useState("Pending");
  const [msg, setMsg] = useState<string>("");
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const handleActiveBtn = (activeText: any) => setActiveBtn(activeText);
  const handleMenuSelected = (selectedMenu: any) =>
    setMenuSelected(selectedMenu);
  const initialFocusRef = useRef(null);

  const fetchAppointments = async () => {
    const resp = await axios.get(`${baseURL}/get-appointments`);

    setAppointments(resp.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  console.log(appointments);

  const sendUpdates = async () => {

    const phones = getphones(appointments);
    if (!msg || phones.length === 0) {
      return;
    }

    let message = msg

    try {
      setMsg("")
      toast.success("Updates sent")
      await axios.post(`${baseURL}/send-bulk-updates`, {
        message,
        phones
      })
    } catch (err) {
      console.log(err)
    }



  }


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
            <Popover initialFocusRef={initialFocusRef}
              placement='bottom'
            >
              <PopoverTrigger>
                <Button bg={"gray.200"}
                  textTransform={"uppercase"}
                  color={"black"}

                  fontSize={"xs"} _hover={{
                    bg: "gray.300",
                  }}>Send Updates</Button>
              </PopoverTrigger>
              <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
                <PopoverHeader pt={4} fontWeight='bold' border='0'>
                  Send Updates
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <Textarea placeholder="Type something ..." value={msg} onChange={e => setMsg(e.target.value)} />
                </PopoverBody>
                <PopoverFooter
                  border='0'
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  pb={4}
                >

                  <ButtonGroup size='sm'>
                    <Button colorScheme='green' onClick={sendUpdates}>Send</Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
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
          columns={[2, 3, 7, 7]}
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
          <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
            Action
          </Text>
        </SimpleGrid>
        {appointments.length > 0 ? (
          appointments.map((item, i) => (
            <FarmItem item={item} key={i} refresh={fetchAppointments} />
          ))
        ) : (
          <Text>No Appointments</Text>
        )}
      </Box>
    </>
  );
};

const FarmItem = ({
  item,
  refresh,
}: {
  item: IAppointment;
  refresh?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [appointmentId, setAppointmentId] = useState<number>();
  const [variant, setVariant] = useState<TVariant>();

  const handleOpen = (currVariant: TVariant) => {
    setIsOpen(true);
    setAppointmentId(item.appointmentId);
    setVariant(currVariant);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <SimpleGrid
        columns={[2, 3, 7, 7]}
        spacing={4}
        mt={6}
        w={"full"}
        bg={"white"}
        borderRadius={"lg"}
        p={4}
        boxShadow={"2xl"}
        cursor={"pointer"}
        _hover={{
          bg: "gray.100",
        }}
        transition={
          "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
        }
      >
        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.service}
        </Text>
        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.phone}
        </Text>
        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.name}
        </Text>
        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.id}
        </Text>

        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.date} {item?.time}
        </Text>
        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.status}
        </Text>
        <HStack spacing={2}>
          {(item.status as AppointementStatus) ===
            AppointementStatus.Pending ? (
            <>
              <Button
                bg={"black"}
                color={"white"}
                textTransform={"uppercase"}
                fontSize={"xs"}
                _hover={{
                  bg: "gray.700",
                }}
                transition={
                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                }
                onClick={() => handleOpen("approve")}
              >
                Approve
              </Button>
              <Button
                bg={"black"}
                color={"white"}
                textTransform={"uppercase"}
                fontSize={"xs"}
                _hover={{
                  bg: "gray.700",
                }}
                transition={
                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                }
                onClick={() => handleOpen("cancel")}
              >
                Reject
              </Button>
            </>
          ) : (
            <Tag
              size={"lg"}
              colorScheme={
                item.status === AppointementStatus.Approved ? "green" : "red"
              }
              variant={"solid"}
            >
              {item.status}
            </Tag>
          )}
        </HStack>
      </SimpleGrid>
      <ApproveCancelDialog
        isOpen={isOpen}
        onClose={handleClose}
        variant={variant as TVariant}
        appointmentId={appointmentId as number}
      />
    </>
  );
};

const ApproveCancelDialog = ({
  isOpen,
  onClose,
  variant,
  appointmentId,
  refresh,
}: ApproveCancelDialogProps) => {
  const cancelRef = useRef(null);

  const approveAppointment = async () => {
    const id = toast.loading("Approving appointment, please wait...");
    try {
      const res = await axios.post(`${baseURL}/approve-appointments`, {
        appointmentId,
      });
      if (res.status === 200) {
        toast.success("Appointment approved successfully", {
          id,
        });
        refresh?.();
      } else {
        toast.error("Error approving appointment", {
          id,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error approving appointment", {
        id,
      });
    } finally {
      toast.dismiss();
      onClose();
    }
  };

  const rejectAppointment = async () => {
    const id = toast.loading("Rejecting appointment, please wait...");

    try {
      const res = await axios.post(`${baseURL}/cancel-appointments`, {
        appointmentId,
      });

      if (res.status === 200) {
        toast.success("Appointment rejected successfully", {
          id,
        });
        refresh?.();
      } else {
        toast.error("Error rejecting appointment", {
          id,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(
        "Error rejecting appointment, please check your internet connection",
        { id }
      );
    } finally {
      toast.dismiss();
      onClose();
    }
  };

  const handleClick = async () => {
    if (variant === "approve") {
      await approveAppointment();
    } else {
      await rejectAppointment();
    }
    onClose();
  };
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure you want to{" "}
          {variant === "approve" ? "approve" : "reject"} this appointment?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme={variant === "approve" ? "green" : "red"}
            ml={3}
            onClick={handleClick}
          >
            {variant === "approve" ? "Approve" : "Reject"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default dashboard;
