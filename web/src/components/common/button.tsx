import { HTMLProps, forwardRef } from 'react';
import {
  buttonBaseClassName,
  buttonScaleUp,
  buttonVariants,
} from './button-styles';

export default forwardRef<
  HTMLButtonElement,
  Omit<HTMLProps<HTMLButtonElement>, 'ref'> & {
    variant?: keyof typeof buttonVariants;
    scaleUp?: boolean;
  }
>(function Button(
  { variant = 'primary', scaleUp = true, className, ...props },
  ref
) {
  return (
    <button
      {...props}
      // @ts-expect-error this should be fine idk why it hates us
      type={props.type || 'button'}
      className={`${buttonBaseClassName} ${buttonVariants[variant]} ${scaleUp ? buttonScaleUp : ''} ${className}`}
      ref={ref}
    />
  );
});
