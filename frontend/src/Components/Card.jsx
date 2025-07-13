import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  border = true,
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const cardClasses = classNames(
    'bg-white',
    paddingClasses[padding] || paddingClasses.md,
    shadowClasses[shadow],
    roundedClasses[rounded] || roundedClasses.lg,
    {
      'border border-gray-200': border,
      'transition-all duration-200 hover:shadow-lg': hoverable,
      'hover:border-gray-300': hoverable && border,
    },
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  className = '',
  withBorder = false,
  ...props
}) => {
  const headerClasses = classNames(
    'pb-4',
    {
      'border-b border-gray-200 mb-4': withBorder,
    },
    className
  );

  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) => {
  return (
    <Component 
      className={classNames(
        'text-lg font-semibold text-gray-900',
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
};

const CardSubtitle = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p 
      className={classNames(
        'mt-1 text-sm text-gray-500',
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );
};

const CardBody = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={classNames(
        'text-gray-700',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({
  children,
  className = '',
  withBorder = false,
  ...props
}) => {
  const footerClasses = classNames(
    'pt-4',
    {
      'border-t border-gray-200 mt-4': withBorder,
    },
    className
  );

  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hoverable: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  border: PropTypes.bool,
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  withBorder: PropTypes.bool,
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span']),
};

CardSubtitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  withBorder: PropTypes.bool,
};

export default Card;
