import { ButtonProps, DivProps } from 'react-html-props';
import cn from 'classnames';
import styles from './BottomButton.module.css';
import { ReactEventHandler } from 'react';
import { Button, ButtonContentProps } from 'semantic-ui-react';

export interface BottomButtonProps extends ButtonContentProps {
	handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	disabled: boolean;
	children: React.ReactNode;
}

export const BottomButton = ({
	handleClick,
	disabled=false,
	color = 'primary',
	children,
	className,
	...props
}: BottomButtonProps): JSX.Element => {
	return (
		<Button
			className={cn(className, styles.SendButton)}
			disabled={disabled}
			onClick={handleClick}
			color={color}
			size="massive"
			{...props}
		>
			{children}
		</Button>
	);
};
