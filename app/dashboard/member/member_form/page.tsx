"use client";
import { mdiAccount, mdiMail, mdiWalletMembership, mdiCalendarAccount, mdiGenderNonBinary, mdiCellphone, mdiAccountGroup, mdiHandshake } from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import Button from "../../../_components/Button";
import Buttons from "../../../_components/Buttons";
import CardBox from "../../../_components/CardBox";
import FormField from "../../../_components/FormField";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../_lib/config";
import FormGrid from "../../../_components/FormField/FormGrid";
import {  useState } from "react";
import CardBoxModal from "../../../_components/CardBox/Modal";
import { _initCardBoxModel } from "../../../_models/cardbox.model";
export default function FormsPage() {
    const commonmessage = "Do you want to save member"
    const handleSubmit = (values, { setSubmitting }) => {
        try {
            console.log("Form submitted:", values);
            setInitCardBoxModel({..._initCardBoxModel , message :commonmessage , isActive : true});
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setSubmitting(false);
        }
    };
    const [initCardBoxModel, setInitCardBoxModel] = useState(_initCardBoxModel);
    const initdata = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone: "",
        gender: "",
        birthday: "",
        sponsor: "",
        placement: "",
    }
    const handleModalActionConfirm = () => {
        setInitCardBoxModel(prev => ({ ...prev, isActive: false }));
        setTimeout(() => {
            setInitCardBoxModel(prev => ({ ...prev, isActive: true , message : "Save OK" , isAction : false , buttonColor : "success" })); 
        }, 1000);
        
    };
    const handleModalActionCancel = () => {
        setInitCardBoxModel(prev => ({ ...prev, isActive: false }));
     
    };
    return (
        <>
            <CardBoxModal
                title= "Save Member"
                buttonColor={initCardBoxModel.buttonColor}
                buttonLabel={initCardBoxModel.buttonLabel}
                isActive={initCardBoxModel.isActive}
                onConfirm={handleModalActionConfirm}
                onCancel={handleModalActionCancel}
                isAction = {initCardBoxModel.isAction}
            >
                <p>
                   {initCardBoxModel.message}
                </p>
            </CardBoxModal>
            <Head>
                <title>{getPageTitle("Forms")}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiWalletMembership}
                    title="Member Register Form WOWCNS"
                    main
                ></SectionTitleLineWithButton>
                <CardBox>
                    <Formik
                        initialValues={initdata}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <FormGrid>
                                    <FormField label="First Name" labelFor="firstname" icon={mdiAccount}>
                                        {({ className }) => (
                                            <Field
                                                name="firstname"
                                                id="firstname"
                                                placeholder="First name"
                                                className={className}
                                            />
                                        )}
                                    </FormField>
                                    <FormField label="Last Name" labelFor="lastname" icon={mdiAccount}>
                                        {({ className }) => (
                                            <Field
                                                name="lastname"
                                                id="lastname"
                                                placeholder="Last name"
                                                className={className}
                                            />
                                        )}
                                    </FormField>
                                </FormGrid>
                                <FormGrid>
                                    <FormField label="Birthday" labelFor="birthday" help="Please enter Birthday" icon={mdiCalendarAccount}>
                                        {({ className }) => (
                                            <Field
                                                type="date"
                                                name="birthday"
                                                id="birthday"
                                                placeholder="Birthday..."
                                                className={className}
                                            />
                                        )}
                                    </FormField>
                                    <FormField label="Gender" labelFor="gender" icon={mdiGenderNonBinary}>
                                        {({ className }) => (
                                            <Field name="gender" id="gender" component="select" className={className}>
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </Field>
                                        )}
                                    </FormField>
                                </FormGrid>
                                <FormGrid>
                                    <FormField label="Email" labelFor="email" icon={mdiMail}>
                                        {({ className }) => (
                                            <Field
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder="Email"
                                                className={className}
                                            />
                                        )}
                                    </FormField>
                                    <FormField label="Phone" labelFor="phone" help="Help line comes here" icon={mdiCellphone}>
                                        {({ className }) => (
                                            <Field
                                                name="phone"
                                                id="phone"
                                                placeholder="Phone"
                                                className={className}
                                            />
                                        )}
                                    </FormField>
                                </FormGrid>

                                <FormGrid>
                                    <FormField label="Sponsor" labelFor="sponsor" help="Sponsor ID" icon={mdiAccountGroup}>
                                        {({ className }) => (
                                            <Field
                                                name="sponsor"
                                                id="sponsor"
                                                placeholder="sponsor"
                                                className={className}
                                            />
                                        )}
                                    </FormField>
                                    <FormField label="Placement" labelFor="placement" help="Placement ID" icon={mdiHandshake}>
                                        {({ className }) => (
                                            <Field
                                                name="placement"
                                                id="placement"
                                                placeholder="placement"
                                                className={className}
                                            />
                                        )}
                                    </FormField>
                                </FormGrid>

                                <Buttons>
                                    <Button type="submit" color="info" label="Submit" isGrouped disabled={isSubmitting} />
                                    <Button type="reset" color="info" outline label="Reset" isGrouped />
                                </Buttons>
                            </Form>
                        )}
                    </Formik>
                </CardBox>
            </SectionMain>
        </>
    );
}