import { ResumeDto, UpdateResumeDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import debounce from "lodash.debounce";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const updateResume = async (data: UpdateResumeDto, selfSave=false) => {
  if(!selfSave) {
    const response = await axios.patch<ResumeDto, AxiosResponse<ResumeDto>, UpdateResumeDto>(
      `/resume/${data.id}`,
      data,
    );
  
    queryClient.setQueryData<ResumeDto>(["resume", { id: response.data.id }], response.data);
  
    queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
      if (!cache) return [response.data];
      return cache.map((resume) => {
        if (resume.id === response.data.id) return response.data;
        return resume;
      });
    });
  
    return response.data;
  } else {
    try {
      const response = await axios.patch<ResumeDto, AxiosResponse<ResumeDto>, UpdateResumeDto>(
        `/resume/${data.id}`,
        data,
      );
      alert("保存成功");
      queryClient.setQueryData<ResumeDto>(["resume", { id: response.data.id }], response.data);
    
      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [response.data];
        return cache.map((resume) => {
          if (resume.id === response.data.id) return response.data;
          return resume;
        });
      });
    
      return response.data;
    } catch (error) {
      alert("保存失败!!!!请重新保存或者export JSON数据");
    }
  } 
};

export const debouncedUpdateResume = debounce(updateResume, 500);

export const useUpdateResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateResumeFn,
  } = useMutation({
    mutationFn: updateResume,
  });

  return { updateResume: updateResumeFn, loading, error };
};
