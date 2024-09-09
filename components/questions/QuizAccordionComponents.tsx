import { Group, Avatar, Text } from "@mantine/core";
import { ReactNode } from "react";


interface AccordionLabelProps {
    label: string;
    image: ReactNode;
    description: string;
}

export function QuizAccordionLabel({ label, image, description }: AccordionLabelProps) {
    return (
        <Group wrap="nowrap">
            {image}
            <div>
                <Text>{label}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                    {description}
                </Text>
            </div>
        </Group>
    );
}