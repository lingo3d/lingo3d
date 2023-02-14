export default class NullableCallback {
    public constructor(
        public params: Record<
            string,
            String | Number | Boolean | Array<String | Number | Boolean>
        >
    ) {}
}
