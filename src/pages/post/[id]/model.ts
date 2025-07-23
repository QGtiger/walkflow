import { walkflowRequest } from "@/api/walkflowApi";
import { createCustomModel } from "@/common/createModel";
import { chatWithLLM } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useReactive, useRequest } from "ahooks";
import { useParams } from "react-router-dom";

async function generatorPostSchema(
  schema: FlowSchemaV1
): Promise<FlowPostSchema> {
  const hotStep = schema.config.steps.filter((it) => it.type === "hotspot");

  if (hotStep.length === 0) {
    return { content: "没有热点步骤，无法生成文章内容" };
  }

  const res = await chatWithLLM([
    {
      role: "system",
      content:
        "你是一名优秀的文档书写者，善于用精辟的语句来总结引导用户。 我会给你一连串的系统使用说明截图和对应的操作，请你帮我写出合适的引导文案。 并在文章开头写上文章标题和简介。",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: hotStep.reduce(
            (acc, cur, index) => {
              return (acc += `第${index + 1}步: 图片尺寸: (${cur.w}, ${
                cur.h
              }), 图片地址: (${cur.screenshotUrl}), 用户在 (${cur.x}, ${
                cur.y
              }) 位置点击${
                cur.title ? `, 点击文案为 ${cur.title}。` : "。"
              }\n`);
            },
            `请根据以下步骤和截图生成引导文案，要求简洁明了，突出每个步骤的关键点。 并带上图片引导展示， 格式为

$$hotspot
{
  "h": 958, // 图片高度
  "w": 1728, // 图片宽度
  "x": 686, // 点击位置 x 坐标
  "y": 743, // 点击位置 y 坐标
  "screenshotUrl": "https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/r5gn45k76g8mc4mwc8p__clicks_16465.png" // 截图地址
}
$$


          \n`
          ),
        },
        ...hotStep.reduce((acc, cur) => {
          acc.push({
            type: "image_url",
            image_url: {
              url: cur.screenshotUrl,
            },
          });
          return acc;
        }, [] as Array<{ type: "image_url"; image_url: { url: string } }>),
      ],
    },
  ]);

  return { content: res.choices[0].message.content };
}

export const FlowPostDetailModel = createCustomModel(() => {
  const { id } = useParams();

  // 用响应式数据
  const viewModel = useReactive({
    postSchema: undefined as FlowPostSchema | undefined,
    loadingText: "加载中...",
  });

  const { postSchema, loadingText } = viewModel;

  useQuery({
    queryKey: ["flowEdit", id],
    queryFn: async () => {
      viewModel.loadingText = "加载流程详情...";
      const { data } = await walkflowRequest<WalkflowDetail>({
        url: `detail/${id}`,
      });

      if (data) {
        let { postSchema } = data;
        if (!postSchema) {
          viewModel.loadingText = "流程详情加载完成，正在 AI 初始化文章内容...";
          postSchema = await generatorPostSchema(data.schema);
          await updateWalkflow(postSchema);
        }
        viewModel.postSchema = postSchema;
      }

      return data;
    },
  });

  const { runAsync: updateWalkflow } = useRequest(
    async (postSchema: FlowPostSchema) => {
      await walkflowRequest({
        url: "/update",
        method: "POST",
        data: {
          postSchema,
          flowId: id,
        },
      });
      viewModel.postSchema = postSchema;
    },
    {
      manual: true,
      debounceWait: 600,
    }
  );

  return {
    // 这里配合 layout 进行数据断言
    postSchema: postSchema!,

    updateWalkflow,

    loadingText,
  };
});
