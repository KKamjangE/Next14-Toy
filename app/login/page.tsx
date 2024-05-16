import FormButton from "@/app/components/form-btn";
import FormInput from "@/app/components/form-input";
import SocialLogin from "@/app/components/social-login";

export default function Login() {
    const handleForm = async (formData: FormData) => {
        "use server";

        console.log(formData.get("email"), formData.get("password"));
    };
    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.</h2>
            </div>
            <form className="flex flex-col gap-3" action={handleForm}>
                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    errors={[]}
                    required
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    errors={[]}
                    required
                />
                <FormButton loading={false} text="Create account" />
            </form>
            <SocialLogin />
        </div>
    );
}
