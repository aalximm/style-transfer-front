import { DivProps } from 'react-html-props';
import cn from 'classnames';
import styles from './StyleSelect.module.css';
import {
	Segment,
	Image,
	Dropdown,
	DropdownItemProps,
	DropdownProps,
	Message,
	MessageHeader,
	SemanticCOLORS,
} from 'semantic-ui-react';

export interface StyleSelectProps extends DivProps {
	options: DropdownItemProps[]; // eslint-disable-line no-unused-vars
	imageUrl?: string;
	activeDropdownValue?: string;
	isFetching: boolean;
	fetchingError: boolean;
	handleChange: (
		event: React.SyntheticEvent<HTMLElement>, // eslint-disable-line no-unused-vars
		data: DropdownProps, // eslint-disable-line no-unused-vars
	) => void;

	color?: SemanticCOLORS;
}

export const StyleSelect = ({
	options,
	imageUrl,
	activeDropdownValue,
	isFetching,
	fetchingError,
	handleChange,
	className,
	...props
}: StyleSelectProps): JSX.Element => {
	return (
		<Segment
			className={cn(className, styles.segment)}
			basic
			loading={isFetching}
			{...props}
		>
			<>
				{!isFetching && !fetchingError && (
					<>
						<div className={styles.imageContainer}>
							{activeDropdownValue && imageUrl && (
								<Image
									src={imageUrl}
									className={styles.image}
									rounded
									alt="style image"
								/>
							)}
						</div>
						<Dropdown
							selection
							upward
							options={options}
							className={styles.dropdown}
							onChange={handleChange}
							value={activeDropdownValue}
							disabled={isFetching}
							loading={isFetching}
						/>
					</>
				)}
				{!isFetching && fetchingError && (
					<>
						<div className={styles.imageContainer}>
							<Image
								src="https://cdna.artstation.com/p/assets/images/images/046/103/074/large/amir-20220202-170113.jpg"
								className={styles.image}
								rounded
								alt="sad image"
							/>
						</div>
						<Message negative>
							<MessageHeader>Shit happens...</MessageHeader>
							<p>server didn&apos;t respond</p>
						</Message>
					</>
				)}
			</>
		</Segment>
	);
};
