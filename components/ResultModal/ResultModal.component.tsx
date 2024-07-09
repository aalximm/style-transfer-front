import { DivProps } from 'react-html-props';
import cn from 'classnames';
import styles from './ResultModal.module.css';
import {
	Modal,
	Header,
	ModalContent,
	ModalActions,
	Button,
	HeaderSubheader,
	Icon,
} from 'semantic-ui-react';
import { ImageView } from '../ImageView/ImageView.component';

export interface ResultModalProps extends DivProps {
	imageUrl: string;
	title: string;
	description: string;
	open: boolean;
	close: () => void;
}

export const ResultModal = ({
	imageUrl,
	title,
	description,
	open,
	close,
	children,
	className,
	...props
}: ResultModalProps): JSX.Element => {
	const handleDownload = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		const link = document.createElement('a');
		link.href = imageUrl;
		link.download = 'style_transfer_result.jpg';
		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(imageUrl);
	};

	return (
		<Modal basic open={open} centered className={cn(className, styles.modal)} size='small' >
			<Header as="h2" textAlign="center" inverted>
				{title}
				<HeaderSubheader>{description}</HeaderSubheader>
			</Header>
			<ModalContent image scrolling className={styles.content}>
				<ImageView
					basic
					imageUrl={imageUrl}
				/>
			</ModalContent>
			<ModalActions className={styles.actions}>
				<Button icon onClick={handleDownload} size='massive' fluid className={styles.actionButton}>
					<Icon name="download" />
					Download
				</Button>
				<Button onClick={close} size='massive' fluid className={styles.actionButton}>Try Again</Button>
			</ModalActions>
		</Modal>
	);
};