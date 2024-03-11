import { Link, getFocusStyle, getTheme, mergeStyleSets } from "@fluentui/react";
import { memo } from "react";

const theme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
        minHeight: 54,
        padding: 10,
        boxSizing: 'border-box',
        borderBottom: `1px solid ${semanticColors.bodyDivider}`,
        display: 'flex',
        },
    ],
    itemContent: {
        overflow: 'hidden',
        flexGrow: 1,
    },
    itemName: [
        fonts.xLarge,
        {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        },
    ],
    itemIndex: {
        fontSize: fonts.small.fontSize,
        color: palette.neutralTertiary,
        marginBottom: 5,
        marginTop: 5,
    },
});

const arePropsEqual = (prevProps, nextProps) => {
    return prevProps.html_url === nextProps.html_url && 
    prevProps.name === nextProps.name &&
    prevProps.language === nextProps.language &&
    prevProps.description === nextProps.description
};

const Repository = ({html_url, name, language, description}) => {
    return (
        <div className={classNames.itemCell} data-is-focusable={true}>
            <div className={classNames.itemContent} data-testid="contentElement">
                <div className={classNames.itemName}>
                    <Link href={html_url}>
                        {name}
                    </Link>
                </div>
                <div className={classNames.itemIndex}>{language}</div>
                <div>{description}</div>
            </div>
        </div>
    )
};

export default memo(Repository, arePropsEqual);