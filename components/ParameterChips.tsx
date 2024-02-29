import { Chip, Stack, Divider, Typography, Box } from "@mui/material";
import { parameterGroups } from "../utils/types";
import ClearIcon from '@mui/icons-material/Clear';

interface ParameterChipsProps {
    handleClick: (group: string) => void;
}

export const ParameterChips: React.FC<ParameterChipsProps> = ({handleClick}) => {
    return (
        <Box sx={{ marginBottom: 2, display:"flex", alignContent:"center", flexDirection:"column" }}>
            <Typography variant="overline" sx={{ marginBottom: 1 }} align="center">Filter by component</Typography> 
            <Stack 
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                divider={<Divider orientation="vertical" flexItem />}
                sx={{ marginBottom: 2 }}
                justifyContent={"center"}
            >
                {parameterGroups.map((component, index) => (
                    <Chip 
                        key={index} 
                        label={component}   
                        onClick={() => handleClick(component)}  
                    />
                ))}
                    <Chip
                        variant="outlined"
                        label="Clear Filter"
                        onClick={() => handleClick("")}
                        icon={<ClearIcon />}
                    />
            </Stack>
        </Box>
    );
};