import { DivProps } from 'react-html-props';
import cn from 'classnames';
import styles from './StyleSelect.module.css';
import {
	Segment,
	Image,
	Dropdown,
	Select,
	DropdownItemProps,
	Header,
	DropdownProps,
	Dimmer,
	Loader,
	Icon,
	Card,
	Container,
	Message,
	MessageHeader,
} from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { loadStyleOptions } from '@/app/actions/back.loader';
import { tryToPerform } from '@/utils/async.util';
import { getImage } from '@/app/actions/image.loader';

export interface StyleSelectProps extends DivProps {
	setStyleKey: (styleKey: string) => void;
	// options: DropdownItemProps[];
}


export const StyleSelect = ({
	setStyleKey,
	// options,
	className,
	color,
	...props
}: StyleSelectProps): JSX.Element => {
	const [options, setOptions] = useState<DropdownItemProps[]>([])
	const [imageUrlMap, setImageUrlMap] = useState<Map<string, string>>();
	const [activeStyleKey, setActiveStyleKey] = useState<string>();
	const [dropdownText, setDropdownText] = useState<any>();
	const [isFetching, setIsFetching] = useState<boolean>(true);
	const [fetchingError, setFetchingError] = useState<boolean>(false);

	const handleChange: (
		event: React.SyntheticEvent<HTMLElement>,
		data: DropdownProps,
	) => void = (e, props) => {
		console.log(props);
		const option = props.options?.filter((v) => v.value == props.value)[0];

		if (!option) {
			return;
		}

		setDropdownText(option.text);
		setActiveStyleKey(props.value as string);
		setStyleKey(props.value as string);
	};

	const fetchOptions = async () => {
		
		const response = await tryToPerform(
			loadStyleOptions
		)

		if (!response.success) {
			setFetchingError(true);
			setIsFetching(false);
			return;
		}

		const responseBody = response.result;

		const tempOptions: DropdownItemProps[] = [];
		const tempImgUrlMap: Map<string, string> = new Map();



		responseBody.map(async (style) => {
			const option: DropdownItemProps = {
				text: style.name,
				description: style.description,
				key: style.style_key,
				value: style.style_key,
			};

			tempOptions.push(option);
			tempImgUrlMap.set(style.style_key, await getImage(style.image_url));
		});

		setOptions(tempOptions);
		setImageUrlMap(tempImgUrlMap);

		setStyleKey(tempOptions[0].key);

		setActiveStyleKey(tempOptions[0].key);
		setDropdownText(tempOptions[0].text);

		setIsFetching(false);
	};

	useEffect(() => {
		fetchOptions();
	}, []);

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
							{activeStyleKey && imageUrlMap && (
								<Image
									src={imageUrlMap.get(activeStyleKey)}
									className={styles.image}
									rounded
								/>
							)}
						</div>
						<Dropdown
							selection
							options={options}
							fluid
							floating
							pointing="bottom"
							className={styles.dropdown}
							onChange={handleChange}
							text={dropdownText}
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
							/>
						</div>
						<Message negative>
							<MessageHeader>Shit happens...</MessageHeader>
							<p>server didn't respond</p>
						</Message>
					</>
				)}
			</>
		</Segment>
	);
};
