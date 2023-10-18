import {Box, Grid} from "@mui/material";
import Image from "next/image";


interface ImageRowProps {
	src: string;
	alt: string;
	imageContainerProps?: any;
	textContainerProps?: any;
	containerProps: any;
	children?: any;
}

const ImageRow = ({src, alt, imageContainerProps, textContainerProps, containerProps, children}: ImageRowProps ) => {

	return (
		<Box bgcolor={"#e8f6ff"} px={2} pb={2} borderRadius={3} mt={5} {...containerProps}>
			<Grid	container spacing={2} alignItems="center">
				<Grid item xs={12} md={6} {...imageContainerProps}>
					<Image width={1000} height={1000} src={src} alt={alt} />
				</Grid>
				<Grid item xs={12} md={6} {...textContainerProps}>
					{children}
				</Grid>
			</Grid>
		</Box>
	)
}

export default ImageRow
