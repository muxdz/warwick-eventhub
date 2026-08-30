import SocietyCreateForm from "@/components/SocietyCreateForm";

type CreateSocietyProps = {};

export default function CreateSociety(props: CreateSocietyProps) {
    return (
        <main>
            <h1>Create Society</h1>
            <SocietyCreateForm />
        </main>
    );
} 