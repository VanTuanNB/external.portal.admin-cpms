import { Button } from 'antd';
import { BaseButtonProps } from 'antd/es/button/button';
import { ReactNode } from 'react';
type TypeButtonProps = {
    type?: BaseButtonProps['type'];
    children: ReactNode;
};
function CustomButton({ type = 'default', children }: TypeButtonProps) {
    return <Button type={type}>{children}</Button>;
}

export default CustomButton;
