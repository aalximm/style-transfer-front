import { DivProps } from 'react-html-props';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';
import {
	useRef,
} from 'react';

export interface FileUploaderProps extends DivProps {
	description: string;
	buttonText: string;
	setImageUrl: (url: string) => void;
}

export const FileUploader = ({
	description,
	buttonText,
	setImageUrl,
	className,
	...props
}: FileUploaderProps): JSX.Element => {
	const fileInputRef = useRef(null);

	const onUploadClick = () => {
		(fileInputRef as any).current.click();
	};

	const handleFileChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log('trying to upload');
		if (
			e.target.files &&
			e.target.files[0]
		) {
			setImageUrl(URL.createObjectURL(e.target.files[0]));
		}
	};

	return (
		<Segment placeholder>
			<Header icon>
				<Icon name="upload" />
				{description}
			</Header>
			<Button secondary onClick={onUploadClick}>
				{buttonText}
			</Button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/png, image/jpeg"
				hidden
				onChange={handleFileChanges}
			></input>
		</Segment>
	);
};
