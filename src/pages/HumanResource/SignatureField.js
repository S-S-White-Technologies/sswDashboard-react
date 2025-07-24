// SignatureField.jsx
import React, { useEffect } from 'react';
import { Row, Col, Label, Input } from 'reactstrap';
import Flatpickr from 'react-flatpickr';

const fontOptions = ['Pacifico', 'Great Vibes', 'Satisfy', 'Dancing Script', 'Allura'];

const SignatureField = ({ role, formData, setFormData, readOnlyFont, readOnlyDate }) => {
    const fullName = JSON.parse(sessionStorage.getItem('authUser'))?.name || '';
    const normalizeRole = (role) => {
        if (role === "manager") return "manager";
        if (role === "supervisor") return "manager";
        if (role === "employee") return "employee";
        if (role === "hr admin") return "hr";
        return role;
    };
    const normalizedRole = normalizeRole(role);
    const selectedFont = formData.summary.signatures?.[`${normalizedRole}Font`] || fontOptions[0];
    const signatureName = formData.summary.signatures?.[`${normalizedRole}Name`] || '';
    const signatureDate = formData.summary.signatures?.[`${normalizedRole}Date`] || '';
    const fullRole = normalizeRole(JSON.parse(sessionStorage.getItem('authUser'))?.role?.toLowerCase());

    const isCurrentUser = role?.toLowerCase().trim() === fullRole?.toLowerCase().trim();

    // Set name if current user
    useEffect(() => {
        if (!formData.summary.signatures?.[`${normalizedRole}Name`] && isCurrentUser && fullName) {
            setFormData(prev => ({
                ...prev,
                summary: {
                    ...prev.summary,
                    signatures: {
                        ...prev.summary.signatures,
                        [`${normalizedRole}Name`]: fullName
                    }
                }
            }));
        }
    }, [fullName, isCurrentUser, role]);

    console.log("role prop:", role);
    console.log("fullRole from session:", fullRole);
    console.log("isCurrentUser:", isCurrentUser);
    console.log("finalFormData :", formData);
    console.log("FinalFullname :", fullName);

    const handleFontChange = (e) => {
        const font = e.target.value;
        setFormData(prev => ({
            ...prev,
            summary: {
                ...prev.summary,
                signatures: {
                    ...prev.summary.signatures,
                    [`${normalizedRole}Font`]: font
                }
            }
        }));
    };

    console.log("finalFormData :", formData);
    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            summary: {
                ...prev.summary,
                signatures: {
                    ...prev.summary.signatures,
                    [`${normalizedRole}Date`]: date[0]
                }
            }
        }));
    };


    return (
        <Row className="mb-4">
            <Col md={6}>
                <br />
                <Input
                    type="text"
                    value={signatureName}

                    style={{
                        fontFamily: selectedFont,
                        fontSize: '1.75rem',
                        backgroundColor: 'white',
                        border: 'none',
                        fontWeight: 500
                    }}
                />

                <Input
                    type="select"
                    className="mt-1"
                    value={selectedFont}
                    onChange={handleFontChange}
                    disabled={readOnlyFont}
                >
                    {fontOptions.map(font => (
                        <option key={font} value={font}>{font}</option>
                    ))}
                </Input>
            </Col>
            <Col md={6}>
                <Label>Date</Label>
                <Flatpickr
                    value={signatureDate}
                    className="form-control"
                    onChange={handleDateChange}
                    options={{ dateFormat: 'Y-m-d' }}
                    disabled={readOnlyDate}
                />
            </Col>
        </Row>
    );
};

export default SignatureField;
