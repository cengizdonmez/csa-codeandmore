/* AdditionalDevelopment page */
import React from 'react';
import { Card, Alert } from "antd";
import { useIntl } from "umi";

export default function AdditionalDevelopment() {
    const { formatMessage } = useIntl();
    return (
        <div>
            <Card style={{ marginBottom: 10 }}>
                <Alert
                    message={formatMessage({ id: "general.additional-development" })}
                    type="success"
                    showIcon
                    banner
                    style={{ margin: -12 }}
                />
            </Card>
        </div>
    );
}
