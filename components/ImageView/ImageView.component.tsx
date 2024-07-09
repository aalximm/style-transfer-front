import { DivProps } from 'react-html-props';
import cn from 'classnames';
import styles from './ImageView.module.css';
import {
	Container,
	Image,
	Button,
	Segment,
	SemanticCOLORS,
} from 'semantic-ui-react';

export interface ImageViewProps extends DivProps {
	imageUrl: string;
	deleteImage?: () => void;
	basic?: boolean;
}

export const ImageView = ({
	imageUrl,
	deleteImage,
	className,
	basic = true,
	color,
	...props
}: ImageViewProps): JSX.Element => {
	return (
		<Segment
			className={cn(className, styles.image_container)}
			basic={basic}
			{...props}
		>
			<>
				<Image src={imageUrl} className={styles.image} rounded />
				{deleteImage !== undefined && (
					<Button
						circular
						icon="undo"
						size="large"
						className={styles.sync_button}
						color="red"
						onClick={deleteImage}
					/>
				)}
			</>
		</Segment>
	);
};