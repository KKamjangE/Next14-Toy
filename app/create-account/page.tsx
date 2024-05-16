import FormButton from "@/app/components/form-btn";
import FormInput from "@/app/components/form-input";
import SocialLogin from "@/app/components/social-login";

export default function CreateAccount() {
    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form className="flex flex-col gap-3">
                <FormInput
                    type="text"
                    placeholder="Username"
                    errors={[]}
                    required
                />
                <FormInput
                    type="email"
                    placeholder="Email"
                    errors={[]}
                    required
                />
                <FormInput
                    type="password"
                    placeholder="Password"
                    errors={[]}
                    required
                />
                <FormInput
                    type="password"
                    placeholder="Confirm Password"
                    errors={[]}
                    required
                />
                <FormButton loading={false} text="Create account" />
            </form>
            <SocialLogin />
        </div>
    );
}
