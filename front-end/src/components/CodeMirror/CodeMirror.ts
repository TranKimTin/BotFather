import { ref, watch } from "vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, completeFromList } from "@codemirror/autocomplete";

export default {
    name: "CodeMirror",
    components: {
        Codemirror,
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue'],
    setup(props: any, context: { emit: (event: 'update:modelValue', value: string) => void }) {
        const code = ref("");

        const myFunctions = [
            { label: "myFunction1", type: "function", info: "function myFunction1()" },
            { label: "myFunction2", type: "function", info: "function myFunction2(param)" },
            { label: "calculateSum", type: "function", info: "function calculateSum(a, b)" },
            { label: "printMessage", type: "function", info: "function printMessage(message)" },
        ];

        const customAutocomplete = completeFromList(
            myFunctions.map(func => ({
                label: func.label,
                type: func.type,
                info: func.info,
            }))
        );

        const extensions = [
            // javascript(),
            autocompletion({
                override: [customAutocomplete],
            }),
        ];

        const editorOptions = {
            theme: "default",
            lineNumbers: false,
            lineWrapping: false,
            // keyMap: {
            //     'Enter': (cm: { preventDefault: () => void; }) => {
            //         cm.preventDefault(); // Ngăn phím Enter
            //     }
            // }
        };


        watch(code, (newValue) => {
            context.emit('update:modelValue', newValue);
        });

        watch(props, (newValue) => {
            code.value = newValue.modelValue;
        });


        return { code, extensions, editorOptions };
    },
};