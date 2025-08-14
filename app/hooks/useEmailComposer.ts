import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import adminService from "@/app/services/admin.service";
import { IEmailData } from "@/app/types/admin.type";
import toast from "react-hot-toast";

export const EMAIL_TEMPLATES = [
    {
        id: "notification",
        name: "General Notification",
        subject: "Important Update",
        body: `<p>Dear Customer,</p>\n<p>We hope this email finds you well. We wanted to inform you about an important update regarding your account.</p>\n<p>If you have any questions, please don't hesitate to contact our support team.</p>\n<p>Best regards,<br>The Team</p>`,
    },
    {
        id: "promotional",
        name: "Promotional Offer",
        subject: "Special Offer Just for You!",
        body: `<p>Dear Customer,</p>\n<p>We're excited to offer you an exclusive discount on our latest collection!</p>\n<p>Use code <strong>SPECIAL20</strong> to get 20% off your next purchase.</p>\n<p>This offer is valid for a limited time only.</p>\n<p>Happy shopping!<br>The Team</p>`,
    },
    {
        id: "order_update",
        name: "Order Update",
        subject: "Your Order Status Update",
        body: `<p>Dear Customer,</p>\n<p>We wanted to update you on the status of your recent order.</p>\n<p>Your order is currently being processed and will be shipped soon.</p>\n<p>You'll receive a tracking number once it's shipped.</p>\n<p>Thank you for your patience!<br>The Team</p>`,
    },
];

export default function useEmailComposer() {
    const [showPreview, setShowPreview] = useState(false);
    const [emailData, setEmailData] = useState<IEmailData>({
        to: [],
        subject: "",
        body: "",
        template: "",
        buttonText: "",
        buttonUrl: "",
        footerText: "",
        previewText: "",
    });

    const sendEmailMutation = useMutation({
        mutationFn: (data: IEmailData) => adminService.sendEmail(data),
        onSuccess: () => {
            toast.success("Email sent successfully!");
            setEmailData({
                to: [],
                subject: "",
                body: "",
                template: "",
                buttonText: "",
                buttonUrl: "",
                footerText: "",
                previewText: "",
            });
        },
        onError: (error) => {
            toast.error("Failed to send email. Please try again.");
            console.error("Email send error:", error);
        },
    });

    const handleTemplateChange = (templateId: string) => {
        const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
        if (template) {
            setEmailData((prev) => ({
                ...prev,
                template: templateId,
                subject: template.subject,
                body: template.body,
            }));
        }
    };

    const addRecipient = () => {
        setEmailData((prev) => ({
            ...prev,
            to: [...prev.to, ""],
        }));
    };

    const removeRecipient = (index: number) => {
        setEmailData((prev) => ({
            ...prev,
            to: prev.to.filter((_, i) => i !== index),
        }));
    };

    const updateRecipient = (index: number, value: string) => {
        setEmailData((prev) => {
            const newTo = [...prev.to];
            newTo[index] = value;
            return {
                ...prev,
                to: newTo,
            };
        });
    };

    const handleSendEmail = () => {
        if (!emailData.to.length || !emailData.subject || !emailData.body) {
            toast.error("Please fill in all required fields");
            return;
        }
        sendEmailMutation.mutate(emailData);
    };

    return {
        emailData,
        setEmailData,
        showPreview,
        setShowPreview,
        handleTemplateChange,
        addRecipient,
        removeRecipient,
        updateRecipient,
        handleSendEmail,
        sendEmailMutation,
        EMAIL_TEMPLATES,
    };
}