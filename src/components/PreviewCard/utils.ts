import { deepClone } from '@/utils';

function fetchResourceWithBlobUrl(
  url: string,
  options?: RequestInit,
): Promise<{ blobUrl: string; response: Response }> {
  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      return { blobUrl, response: new Response(blob) };
    });
}

export async function preloadSchemaResources(schema: FlowSchemaV1): Promise<FlowSchemaV1> {
  const cloneSchema = deepClone(schema);
  const { designer, config } = cloneSchema;

  await Promise.all([
    designer.background
      ? fetchResourceWithBlobUrl(designer.background).then(({ blobUrl }) => {
          designer.background = blobUrl;
        })
      : Promise.resolve(),
    config.screenRecordingUrl
      ? fetchResourceWithBlobUrl(config.screenRecordingUrl).then(({ blobUrl }) => {
          config.screenRecordingUrl = blobUrl;
        })
      : Promise.resolve(),
    ...config.steps.reduce((promises, step) => {
      if (step.type === 'hotspot' && step.screenshotUrl) {
        promises.push(
          fetchResourceWithBlobUrl(step.screenshotUrl).then(({ blobUrl }) => {
            step.screenshotUrl = blobUrl;
          }),
        );
      }
      return promises;
    }, [] as Promise<void>[]), // Assuming steps may have resources to preload
  ]);

  return cloneSchema;
}
