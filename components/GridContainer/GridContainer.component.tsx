import { DivProps } from 'react-html-props';
import cn from 'classnames';
import styles from './GridContainer.module.css';
import { ReactNode } from 'react';
import { Grid } from 'semantic-ui-react';

export interface GridContainerProps extends DivProps {
	topLeftContent: React.ReactNode;
	topRightContent: React.ReactNode;
	bottomContent: React.ReactNode;
}

export const GridContainer = ({
	topLeftContent,
	topRightContent,
	bottomContent,
	...props
}: GridContainerProps): JSX.Element => {
	return (
		// <Grid container className={styles.full_height}>
		// 	<Grid.Row columns={2} className={styles.image_row} stretched>
		// 		<Grid.Column className={styles.image_column}>
		// 			{topLeftContent}
		// 		</Grid.Column>
		// 		<Grid.Column className={styles.image_column}>
		// 			{topRightContent}
		// 		</Grid.Column>
		// 	</Grid.Row>
		// 	<Grid.Row columns={1} className={styles.button_row}>
		// 		{bottomContent}
		// 	</Grid.Row>
		// </Grid>
		<Grid container className={styles.full_height}>
			{/* Ряд для больших экранов */}
			<Grid.Row
				columns={2}
				className={styles.image_row}
				stretched
				only='computer tablet'
			>
				<Grid.Column className={styles.image_column}>
					{topLeftContent}
				</Grid.Column>
				<Grid.Column className={styles.image_column}>
					{topRightContent}
				</Grid.Column>
			</Grid.Row>

			{/* Ряд для мобильных устройств */}
			<Grid.Row
				columns={1}
				className={styles.image_row_mobile}
				stretched
				only="mobile"
			>
				<Grid.Column className={styles.image_column_mobile}>
					{topLeftContent}
				</Grid.Column>
				
			</Grid.Row>
			<Grid.Row
				columns={1}
				className={styles.image_row_mobile}
				stretched
				only="mobile"
			>
				<Grid.Column className={styles.image_column_mobile}>
					{topRightContent}
				</Grid.Column>
				
			</Grid.Row>

			<Grid.Row columns={1} className={styles.button_row_mobile}>
				{bottomContent}
			</Grid.Row>
		</Grid>
	);
};
