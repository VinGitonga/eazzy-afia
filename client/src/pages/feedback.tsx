import { Helmet } from 'react-helmet'
import { Box, Text, SimpleGrid, Flex } from '@chakra-ui/react'
import { IFeedback } from '@/types/Feedback';
import { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = "https://eazzy-api-wk0c.onrender.com";

const feedback = () => {
    const [feedbacks, setFeedbacks] = useState<IFeedback[]>([
    ]);

    const fetchFeedbacks = async () => {
        const resp = await axios.get(`${baseURL}/get-feedbacks`);

        setFeedbacks(resp.data);
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    console.log(feedbacks);

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Box px={4} w={"full"}>
                <Flex textTransform={'uppercase'} fontSize="xl"
                    fontFamily="monospace"
                    fontWeight="bold">FeedBacks
                </Flex>
                <SimpleGrid
                    columns={[2, 3, 4, 4]}
                    spacing={4}
                    mt={6}
                    w={"full"}
                    bg={"gray.200"}
                    borderRadius={"lg"}
                    p={4}
                >
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                        NationalID
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                        PhoneNo
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                        Date
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                        Feedback
                    </Text>

                </SimpleGrid>
                {feedbacks.length > 0 ? (
                    feedbacks.map((item, i) => (
                        <FarmItem item={item} key={i} refresh={fetchFeedbacks} />
                    ))
                ) : (
                    <Text>No Appointments</Text>
                )}
            </Box>
        </>
    );
}

const FarmItem = ({
    item,
    refresh,
}: {
    item: IFeedback;
    refresh?: () => void;
}) => {
    return (
        <>
            <SimpleGrid
                columns={[2, 3, 4, 4]}
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
                    {item?.id}
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
                    {item?.phone}
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
                    {item?.date} {item?.time}
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
                    {item?.feedback}
                </Text>

            </SimpleGrid>

        </>
    );
};

export default feedback
