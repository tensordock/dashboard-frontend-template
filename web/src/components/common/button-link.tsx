import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import {
  buttonBaseClassName,
  buttonScaleUp,
  buttonVariants,
} from './button-styles';

export default forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof Link> & {
    variant?: keyof typeof buttonVariants;
    scaleUp?: boolean;
  }
>(function ButtonLink(
  { variant = 'primary', scaleUp = true, className, ...props },
  ref
) {
  return (
    <Link
      {...props}
      className={`${buttonBaseClassName} ${buttonVariants[variant]} ${scaleUp ? buttonScaleUp : ''} ${className}`}
      ref={ref}
    />
  );
});
