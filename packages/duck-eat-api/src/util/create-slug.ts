export function CreateSlug(data: string) {
	return data.toLocaleLowerCase().replaceAll(" ", "_");
}
