import SocietyCreateForm from "@/components/SocietyCreateForm";

export default function CreateSociety() {
    return (
        <main className="page-shell-narrow">
            <div className="mb-8 text-center"><p className="eyebrow">Build a community</p><h1 className="page-title mt-2">Create a society</h1><p className="page-intro">Give your society a home on EventHub.</p></div>
            <SocietyCreateForm />
        </main>
    );
} 
